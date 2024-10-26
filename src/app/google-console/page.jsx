
import Loader from '@/components/common/Loader';
import dynamic from 'next/dynamic';

const ECommerce = dynamic(() => import('@/components/Dashboard/E-commerce'), {
  ssr: false, 
  loading: () => <Loader/>
});

const GoogleConsole = () => <ECommerce />;

export default GoogleConsole;


