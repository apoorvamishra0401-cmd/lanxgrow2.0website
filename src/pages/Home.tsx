import { useEffect } from 'react';
export default function Home() {
 useEffect(() => {window.location.replace('/' + window.location.search);}, []);
 return <p role="status">Opening LanXgrow…</p>;
}
