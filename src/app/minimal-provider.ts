import { Injectable } from '@angular/core';
import { UserService } from './entities/user/user.service';

@Injectable({
  providedIn : 'root'
})
export class MinimalProvider {
  constructor(private userService: UserService) { }

  load() {
    return new Promise((resolve, reject) => {

      this.userService.updateCurrentUser().then(then => {
        resolve();
      });
    });
  }
}

export function minimalProviderFactory(provider: MinimalProvider) {
  return () => provider.load();
}
