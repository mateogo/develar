export class MainMenuItem {
  title:        string;
  icon:         string;
  active:       boolean;
  groupTitle:   boolean;
  sub:          SubMenuItem[];
  routing:      string;
  externalLink: string;
  budge:        string
  budgeColor:   string;
  rolesOut?:    Array<string>;
  rolesIn?:     Array<string>;
}

export class SubMenuItem {
	title: string;
	routing: string;
  rolesOut?:    Array<string>;
  rolesIn?:     Array<string>;

}