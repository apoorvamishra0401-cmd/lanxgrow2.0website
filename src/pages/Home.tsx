import { useEffect } from 'react';

export default function Home() {
  useEffect(() => { window.location.replace('/founder-homepage.html' + window.location.hash); }, []);
  return <p role="status">Opening LanXgrow…</p>;
}
