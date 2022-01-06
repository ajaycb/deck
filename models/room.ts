import User from "./user"


class Room {
  let users: User[]

  hasHost() {
    users.forEach(user => {
      user.role == User.Role.participant
    });
  }

}

export default Room