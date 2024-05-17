import { Modal } from '@common';
import { useQuery } from '@tanstack/react-query';
import { getBackupProxyService } from '@api';

interface BackupProxyProps extends AntdModalProps {
  envId: string;
}

const BackupProxy = (props: BackupProxyProps) => {
  const { envId, ...restProps } = props;
  useQuery({
    queryKey: ['backupProxy', envId],
    queryFn: () => getBackupProxyService({ envId }),
    enabled: !!props.open,
  });
  return <Modal {...restProps}>backupProxy</Modal>;
};

export default BackupProxy;
