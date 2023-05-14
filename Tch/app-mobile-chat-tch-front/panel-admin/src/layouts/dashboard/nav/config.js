// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Tableau de bord',
    path: '/dashboard/app',
    icon: icon('ic_dashboard'),
  },
  { 
    title: 'Utilisateurs',
    path: '/dashboard/utilisateurs',
    icon: icon('ic_users'),
  },
  {
    title: 'Chat',
    path: '/dashboard/chat',
    icon: icon('ic_chat'),
  },
  {
    title: 'Admin profil',
    path: '/dashboard/account',
    icon: icon('ic_profile'),
  },
];

export default navConfig;
