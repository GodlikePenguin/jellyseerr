import TitleCard from '@app/components/TitleCard';
import TmdbTitleCard from '@app/components/TitleCard/TmdbTitleCard';
import useVerticalScroll from '@app/hooks/useVerticalScroll';
import globalMessages from '@app/i18n/globalMessages';
import type Media from '@server/entity/Media';
import type { WatchlistItem } from '@server/interfaces/api/discoverInterfaces';
import { useIntl } from 'react-intl';

type TmdbListViewProps = {
  items?: Media[];
  plexItems?: WatchlistItem[];
  isEmpty?: boolean;
  isLoading?: boolean;
  isReachingEnd?: boolean;
  onScrollBottom: () => void;
};

const TmdbListView = ({
  items,
  isEmpty,
  isLoading,
  onScrollBottom,
  isReachingEnd,
}: TmdbListViewProps) => {
  const intl = useIntl();
  useVerticalScroll(onScrollBottom, !isLoading && !isEmpty && !isReachingEnd);
  return (
    <>
      {isEmpty && (
        <div className="mt-64 w-full text-center text-2xl text-gray-400">
          {intl.formatMessage(globalMessages.noresults)}
        </div>
      )}
      <ul className="cards-vertical">
        {items?.map((title, index) => {
          return (
            <li key={`${title.ratingKey}-${index}`}>
              <TmdbTitleCard
                id={title.tmdbId}
                tmdbId={title.tmdbId}
                type={title.mediaType}
                canExpand
              />
            </li>
          );
        })}
        {isLoading &&
          !isReachingEnd &&
          [...Array(20)].map((_item, i) => (
            <li key={`placeholder-${i}`}>
              <TitleCard.Placeholder canExpand />
            </li>
          ))}
      </ul>
    </>
  );
};

export default TmdbListView;
