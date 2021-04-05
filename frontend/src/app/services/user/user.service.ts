import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  static readonly storageKey = 'currentUser';
  private user: User;

  constructor() {
    try {
      this.reload();
    } catch (err) {
      console.log(err);
      console.log('Login needed');
    }
  }

  get jwt(): string {
    return this.user.jwt;
  }

  setCurrent(obj: any): void {
    const jwtDecoded: any = JSON.parse(atob(obj.jwt.split('.')[1]));
    console.log('jwt', jwtDecoded);
    const user: User = {
      jwt: obj.jwt,
      jwtExpiry: new Date(jwtDecoded.exp),
      accessHistory: obj.accessHistory.map((a: string) => new Date(a)),
      actionsHistory: obj.actionsHistory.map((o: any) => ({
        date: new Date(o.date),
        action: o.action,
      })),
      active: obj.active,
      comments: obj.comments,
      email: obj.email,
      id: obj.id,
      name: obj.name,
      permissions: obj.permissions,
    };
    if (user.jwtExpiry.getTime() < new Date().getTime()) {
      throw new Error('Jwt expired');
    }
    this.user = user;
    this.save();
  }

  logout(): void {
    localStorage.removeItem(UserService.storageKey);
    this.user = null;
    console.log('User storage cleaned');
  }

  reload(): void {
    const user = localStorage.getItem(UserService.storageKey);
    if (!user) {
      throw new Error('Empty user storage');
    }
    this.setCurrent(JSON.parse(user));
  }

  save(): void {
    localStorage.setItem(UserService.storageKey, JSON.stringify(this.user));
  }

  isLoggedIn(): boolean {
    console.log('Loggedin:', !!this.user);
    return !!this.user;
  }

  isSuperAdmin(): boolean {
    return this.user.permissions.includes(RoleName.SUPERADMIN);
  }

  isAdmin(): boolean {
    return this.user.permissions.findIndex((r: RoleName) => {
      return r === RoleName.SUPERADMIN || r === RoleName.ADMIN;
    }) > -1;
  }

  isAdminLocal(): boolean {
    return this.user.permissions.findIndex((r: RoleName) => {
      return r === RoleName.SUPERADMIN || r === RoleName.ADMIN || r === RoleName.ADMINLOCAL;
    }) > -1;
  }

  isReception(): boolean {
    return this.user.permissions.includes(RoleName.RECEPCION)
      || this.isAdminLocal();
  }

  isCash(): boolean {
    return this.user.permissions.includes(RoleName.CAJA)
      || this.isAdminLocal();
  }

  isWarehouse(): boolean {
    return this.user.permissions.includes(RoleName.ALMACEN)
      || this.isAdminLocal();
  }

  isFamily(): boolean {
    return this.user.permissions.includes(RoleName.FAMILIAR)
      || this.isAdminLocal();
  }
}

export interface User {
  jwt?: string;
  jwtExpiry?: Date;
  accessHistory: Date[];
  actionsHistory: UserAction[];
  active: boolean;
  comments: UserComment[];
  email: string;
  id: string;
  name: string;
  permissions: RoleName[];
}

export interface UserAction {
  date: Date;
  action: string;
}

export interface UserComment {
  author: string;
  comment: string;
}

export enum RoleName {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  ADMINLOCAL = 'adminlocal',
  ALMACEN = 'almacen',
  RECEPCION = 'recepcion',
  FAMILIAR = 'familiar',
  CAJA = 'caja',
}
