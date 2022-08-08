import React, {Suspense} from "react";
import {createRoot} from "react-dom/client";
import PubSub from "pubsub-js";
import {loadFederatedModule} from "./loadFederatedModule";
import Config from "./configs";

import "./index.css";

const App = () => {
  const selectedApp = Config.APPS[Config.DEFAULT_APP];
  const RemoteApp: any = React.lazy(loadFederatedModule(selectedApp.URL, 'host', './RemoteApp'));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RemoteApp PubSub={PubSub} />
    </Suspense>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App/>);
