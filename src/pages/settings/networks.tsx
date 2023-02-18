import SettingsLayout from '@app/components/Settings/SettingsLayout';
import SettingsNetworks from '@app/components/Settings/SettingsNetworks';
import useRouteGuard from '@app/hooks/useRouteGuard';
import { Permission } from '@app/hooks/useUser';
import type { NextPage } from 'next';

const NetworkSettingsPage: NextPage = () => {
  useRouteGuard(Permission.ADMIN);
  return (
    <SettingsLayout>
      <SettingsNetworks />
    </SettingsLayout>
  );
};

export default NetworkSettingsPage;
