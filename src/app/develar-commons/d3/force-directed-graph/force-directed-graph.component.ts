import { Component, ViewChild, OnInit, Input, ViewEncapsulation, ElementRef , AfterViewInit} from '@angular/core';
import { Observable } from 'rxjs';

import * as d3 from 'd3';

@Component({
  selector: 'force-directed-graph',
  templateUrl: './force-directed-graph.component.html',
  styleUrls: ['./force-directed-graph.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForceDirectedGraphComponent implements AfterViewInit {
  @ViewChild('canvasEl', {static: false}) canvasEl: ElementRef;
  private ctx: CanvasRenderingContext2D;

  @Input() data: Array<any> = [];
  @Input() parameter$: Observable<string>;
  public showGraph = true;
  private defaultView = true;
  private actualParam = 'no_definido';
  canvas;
  simulation;
  links; nodes;
  link; node; types;
  height = 800;
  width = 800;
  nodeRadius = 5;
  transform;
  color;
  font = 20;

  constructor() { }

  ngAfterViewInit() {
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.canvas = this.ctx.canvas;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.height;
    this.width = this.canvas.width;

    if (this.parameter$){
      this.parameter$.subscribe(param => {
        this.refreshGraph(param);
      });
    }
  }

  forceGraph() {
    this.transform = d3.zoomIdentity;
    const self = this;
    d3.select(this.canvas)
      .call(d3.drag()
            .container(this.canvas)
            .subject(dragSubject)
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded))
      .call(d3.zoom()
            .scaleExtent([1 / 10, 8])
            .on('zoom', zoomed));

    this.simulation = d3.forceSimulation(this.nodes)
      .force("link", d3.forceLink( this.links).id( d => d['id']) )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(this.width/2, this.height/2))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", simulationUpdate);

    function simulationUpdate() {
      var fontSize = self.font * self.transform[2];
      self.ctx.save();
      self.ctx.clearRect(0, 0, self.width, self.height);
      self.ctx.translate(self.transform.x, self.transform.y);
      self.ctx.scale(self.transform.k, self.transform.k);

      // Draw edges
      self.links.forEach(function(d) {
        self.ctx.beginPath();
        self.ctx.moveTo(d.source.x, d.source.y);
        self.ctx.lineTo(d.target.x, d.target.y);
        self.ctx.lineWidth = Math.sqrt(d.value);
        self.ctx.strokeStyle = self.color(d.type);
        self.ctx.lineWidth = 1.5;
        self.ctx.stroke();

      });
      // Draw nodes
      self.nodes.forEach(function(d, i) {
        self.ctx.textAlign = 'center';
        self.ctx.beginPath();
        // Node fill
        self.ctx.moveTo(d.x + self.nodeRadius, d.y);
        self.ctx.arc(d.x, d.y, self.nodeRadius, 0, 2 * Math.PI);
        // Node outline
        self.ctx.strokeStyle = '#000';
        self.ctx.lineWidth = 1.5;
        self.ctx.stroke();
        self.ctx.fillStyle = '#fff';
        self.ctx.fill();
        // Text
        self.ctx.font = 'bold ' + (fontSize) + 'px sans-serif"';
        self.ctx.strokeStyle = 'white';
        self.ctx.lineWidth = 2;
        self.ctx.lineJoin = 'miter';
        self.ctx.miterLimit = 2;
        self.ctx.strokeText(d.id, d.x, d.y - 10);
        self.ctx.fillStyle = '#000';
        self.ctx.fillText(d.id, d.x, d.y - 10);
      });
      self.ctx.restore();
    }

    function zoomed() {
      self.transform = d3.event.transform;
      simulationUpdate();
    }

    /** Find the node that was clicked, if any, and return it. */
    function dragSubject() {
      const x = self.transform.invertX(d3.event.x);
      const y = self.transform.invertY(d3.event.y);
      const node = self.findNode(self.nodes, x, y, self.nodeRadius+5);
      if (node) {
        node.x =  self.transform.applyX(node.x);
        node.y = self.transform.applyY(node.y);
      }
      // else: No node selected, drag container
      return node;
    }

    function dragStarted() {
      if (!d3.event.active) {
        self.simulation.alphaTarget(0.3).restart();
      }
      d3.event.subject.fx = self.transform.invertX(d3.event.x);
      d3.event.subject.fy = self.transform.invertY(d3.event.y);
    }

    function dragged() {
      d3.event.subject.fx = self.transform.invertX(d3.event.x);
      d3.event.subject.fy = self.transform.invertY(d3.event.y);
    }

    function dragEnded() {
      if (!d3.event.active) {
        self.simulation.alphaTarget(0);
      }
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }
  }

  findNode(nodes, x, y, radius) {
    const rSq = radius * radius;
    let i;
    for (i = nodes.length - 1; i >= 0; --i) {
      const node = nodes[i];
      const dx = x - node.x;
      const dy = y - node.y;
      const distSq = (dx * dx) + (dy * dy);
      if (distSq < rSq) {
        return node;
      }
    }
    // No node selected
    return undefined;
  }

  ///////////////////////

  private refreshGraph(param){
    this.showGraph = false;
    if(! (this.data && this.data.length)) return;
    this.types = Array.from(new Set( this.data.map(d => d['type']) ));
    let _source;
    if(param === 'no_definido'){
      _source = this.data;
      this.defaultView = true;
    } else {
      this.defaultView = false;
      _source = this.data.filter(token => {
        return token.type === param;
      });
    }
    const _nodes = Array.from(new Set( _source.flatMap(l => [l.source, l.target])), id => ({ id }) );
    this.nodes = _nodes.map(d => Object.create(d));
    this.links = _source.map(d => Object.create(d));
    this.showGraph = true;
    this.forceGraph();
  }
}
