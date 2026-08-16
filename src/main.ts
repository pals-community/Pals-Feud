import "./styles/global.css";
import { App } from "./App.js";

const app = document.getElementById('app');
app?.appendChild(
    App()
)