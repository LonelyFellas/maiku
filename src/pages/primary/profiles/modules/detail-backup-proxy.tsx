import { Modal } from '@common';
import { useQuery } from '@tanstack/react-query';
import { getBackupProxyService } from '@api';

interface DetailBackupProxyProps extends AntdModalProps {
  envId: string;
}

const BackupProxy = (props: DetailBackupProxyProps) => {
  const { envId, ...restProps } = props;
  useQuery({
    queryKey: ['backupProxy', envId],
    queryFn: () => getBackupProxyService({ envId }),
    enabled: !!props.open,
    retry: false,
  });
  return <Modal {...restProps}>backupProxy</Modal>;
};

export default BackupProxy;
