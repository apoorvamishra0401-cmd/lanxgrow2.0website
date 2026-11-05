import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { publicPages } from './config/seo';
export { publicPages };
export function render(path: string) {
  return renderToString(<StaticRouter location={path}><App /></StaticRouter>);
}
