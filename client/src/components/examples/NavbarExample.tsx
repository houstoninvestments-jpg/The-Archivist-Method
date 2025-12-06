import Navbar from '../Navbar';

export default function NavbarExample() {
  return <Navbar onLoginClick={() => console.log('Login clicked')} />;
}
