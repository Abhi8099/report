
import Loader from '@/components/common/Loader';
import dynamic from 'next/dynamic';

const AnalyticsComp = dynamic(() => import('@/components/Analytics'), {
  ssr: false, 
  loading: () => <Loader/>
});

const Analytics = () => <AnalyticsComp />;

export default Analytics;


