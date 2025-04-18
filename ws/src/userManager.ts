export class UserManager {
  private static instance: UserManager;
  private users: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  public addUser(){
    const id  = this.getRandomId();
    const User = new User

}


  private getRandomId(){
    return (Math.random()*100).toString(36).substring(2,15)
  }
}
