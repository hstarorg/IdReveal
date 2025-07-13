import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { NavbarIconItem } from './components/NavbarIconItem';

export function MainLayout() {
  return (
    <>
      <header className="shadow-sm py-2 px-6 flex">
        <div className="flex-1 flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-11 w-11 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">ID Reveal</h1>
        </div>
        <div className="flex justify-center items-center">
          <NavbarIconItem tooltip={<span>Submit a bug</span>}>
            <a href="https://github.com/hstarorg/IdReveal/issues" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faBug} />
            </a>
          </NavbarIconItem>
          <NavbarIconItem tooltip="Source on Github">
            <a href="https://github.com/hstarorg/IdReveal" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </NavbarIconItem>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
