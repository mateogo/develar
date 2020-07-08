import {
  Injectable,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
  Type
} from '@angular/core'

@Injectable()
export class DynamicComponentService {
  constructor(
    private _injector: Injector,
    private _resolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef
  ) { }

  public injectComponent<T>(component: Type<T>, propertySetter?: (type: T) => void): HTMLDivElement {
    const compFactory = this._resolver.resolveComponentFactory(component);
    const componentInstance = compFactory.create(this._injector)


    if (propertySetter) {
      propertySetter(componentInstance.instance);
    }

    this._appRef.attachView(componentInstance.hostView)

    let div = document.createElement('div');
    div.appendChild(componentInstance.location.nativeElement);

    return div;
  }
}