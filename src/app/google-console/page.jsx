
import dynamic from 'next/dynamic';

const ECommerce = dynamic(() => import('@/components/Dashboard/E-commerce'), {
  ssr: false
});

const GoogleConsole = () => <ECommerce />;

export default GoogleConsole;


