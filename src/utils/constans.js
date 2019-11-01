export const chats = [
  {
    idChat: "1",
    name: "broadcast",
    lastMessage: "welcome to locha mesh",
    picture: require("./img/fotoperfil.jpg"),
    date: new Date()
  }
];

export const images = {
  noPhoto: { url: require("./img/fotoperfil.jpg") },
  file: { url: require("./img/archivo.jpg") },
  camera: { url: require("./img/camara.jpg") },
  logo: { url: require("./img/logo.png") }
};

export const IntialUser = {
  id: undefined,
  name: undefined,
  image: null,
  contacts: []
};
