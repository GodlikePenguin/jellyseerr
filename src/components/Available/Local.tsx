import Header from '@app/components/Common/Header';
import PageTitle from '@app/components/Common/PageTitle';
import TmdbListView from '@app/components/Common/TmdbListView';
import useMedia from '@app/hooks/useMedia';
import Error from '@app/pages/_error';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  local: 'Local Media',
});

const Local = () => {
  const intl = useIntl();

  const { isEmpty, isLoadingMore, isReachingEnd, titles, fetchMore, error } =
    useMedia('/api/v1/media', {
      filter: 'allavailable',
      sort: 'mediaAdded',
    });

  if (error) {
    return <Error statusCode={500} />;
  }

  return (
    <>
      <PageTitle title={intl.formatMessage(messages.local)} />
      <div className="mt-1 mb-5">
        <Header>{intl.formatMessage(messages.local)}</Header>
      </div>
      <TmdbListView
        items={titles}
        isEmpty={isEmpty}
        isLoading={isLoadingMore}
        isReachingEnd={isReachingEnd}
        onScrollBottom={fetchMore}
      />
    </>
  );
};

export default Local;
