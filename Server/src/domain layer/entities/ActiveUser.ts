export interface ActiveUser {
  socketId: string;
  userType: "admin" | "student";
  userName: string;
  profileImg?: string;
  lastActive: Date;
}
