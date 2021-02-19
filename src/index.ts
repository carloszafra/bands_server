import {SocketsServer} from "./socket/socket";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/users.controller";

let app = new SocketsServer(
    [
        new AuthController(),
        new UserController(),
    ]
).app;

export { app };



