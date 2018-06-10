import { Perms } from '../base.model';


/*******************************************
*  FOLDER folder Folder
*/

interface AssetInFolder {
  _id: string;
  assetId:      string ;
  path:         string ;
  slug:         string ;
  mimetype:     string ;
}

export class Folder {
  id:          string;
  _id:         string;
  name:        string = "";
  slug:        string = "";
  description: string = "";
  estado:      string = "activa";
  tokens:      Array<string> = [];
  persons:     Array<string> = [];
  user:        string = "";
  userId:      string = "";
  perms: Perms = {
    owner:   ['r', 'w', 'x'],
    persons: ['r', 'w'],
    other:   ['r']
  };
  parents:     Array<string> = [];
  tagstr:      string = ""
  taglist:     Array<string> = [];

  assets: Array<AssetInFolder> = [];

  constructor(){

  }
}


function initNewModel(name:string, parent:string, perms: Perms, taglist: Array<string>){
  let folder = new Folder();
  folder.name = name || "";
  if(parent) folder.parents.push(parent);
  if(perms) folder.perms = perms;
  if(taglist){
    folder.taglist = taglist;
    folder.tagstr = taglist.join(' ');
  }

  return folder;
}

const daoConfig = {
  type: 'folder',
  backendURL: 'api/folders',
  searchURL: 'api/folders/search'
}


class FolderModel {
  constructor(){

  }

  initNew(name:string, parent:string, perms: Perms, taglist: Array<string>){
    return initNewModel(name, parent, perms, taglist);
  }

  daoConfig(){
    return daoConfig;
  }


}
export const folderModel = new FolderModel();
