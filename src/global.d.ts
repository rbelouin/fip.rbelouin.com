declare namespace Bacon {
  const history: History;
}

declare function ga(command: "set", what: "page", page: string);
declare function ga(command: "send", what: "pageview");
