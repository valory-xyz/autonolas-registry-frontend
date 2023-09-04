import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import {
  useExtraTabContent,
  getHash,
  isMyTab,
} from 'common-util/List/ListTable/helpers';
import { getMyListOnPagination } from 'common-util/ContractUtils/myList';
import { notifyError } from 'common-util/functions';
import {
  getComponents,
  getFilteredComponents,
  getTotalForAllComponents,
  getTotalForMyComponents,
} from './utils';

const ALL_COMPONENTS = 'all-components';
const MY_COMPONENTS = 'my-components';

const ListComponents = () => {
  const router = useRouter();
  const hash = getHash(router);
  const [currentTab, setCurrentTab] = useState(
    isMyTab(hash) ? MY_COMPONENTS : ALL_COMPONENTS,
  );

  const account = useSelector((state) => get(state, 'setup.account'));

  /**
   * extra tab content & view click
   */
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Components',
    onRegisterClick: () => router.push(URL.MINT_COMPONENT),
  });
  const onViewClick = (id) => router.push(`${URL.COMPONENTS}/${id}`);

  /**
   * filtered list
   */
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);

  // update current tab based on the "hash" in the URL
  useEffect(() => {
    setCurrentTab(isMyTab(hash) ? MY_COMPONENTS : ALL_COMPONENTS);
    setList([]);
  }, [router.asPath]);

  // fetch total
  useEffect(() => {
    (async () => {
      if (searchValue === '') {
        try {
          let totalTemp = null;

          // All components
          if (currentTab === ALL_COMPONENTS) {
            totalTemp = await getTotalForAllComponents();
          }

          // My components
          if (currentTab === MY_COMPONENTS && account) {
            totalTemp = await getTotalForMyComponents(account);
          }

          setTotal(Number(totalTemp));
          if (Number(totalTemp) === 0) {
            setIsLoading(false);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [account, currentTab, searchValue]);

  // fetch the list (without search)
  useEffect(() => {
    (async () => {
      if (total && currentPage && !searchValue) {
        setIsLoading(true);

        try {
          // All components
          if (currentTab === ALL_COMPONENTS) {
            setList([]);
            const everyComps = await getComponents(total, currentPage);
            setList(everyComps);
          }

          /**
           * My components
           * - search by `account` as searchValue
           * - API will be called only once & store the complete list
           */
          if (currentTab === MY_COMPONENTS && list.length === 0 && account) {
            const e = await getFilteredComponents(account);
            setList(e);
          }
        } catch (e) {
          console.error(e);
          notifyError('Error fetching components');
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [account, total, currentPage]);

  /**
   * Search (All components, My Components)
   * - no pagination as we won't know total beforehand as we have to
   *   traverse the entire list
   */
  useEffect(() => {
    (async () => {
      if (searchValue) {
        setIsLoading(true);
        setList([]);

        try {
          const filteredList = await getFilteredComponents(
            searchValue,
            currentTab === MY_COMPONENTS ? account : null,
          );
          setList(filteredList);
          setTotal(0); // total won't be used if search is used
          setCurrentPage(1);
        } catch (e) {
          console.error(e);
          notifyError('Error fetching components');
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [account, searchValue]);

  const tableCommonProps = {
    type: NAV_TYPES.COMPONENT,
    isLoading,
    total,
    currentPage,
    setCurrentPage,
    onViewClick,
    searchValue,
  };

  return (
    <Tabs
      className="registry-tabs"
      type="card"
      activeKey={currentTab}
      tabBarExtraContent={extraTabContent}
      onChange={(e) => {
        setCurrentTab(e);

        setList([]);
        setTotal(0);
        setCurrentPage(1);
        setIsLoading(true);

        // clear the search
        clearSearch();

        // update the URL to keep track of my-components
        router.push(
          e === MY_COMPONENTS
            ? `${URL.COMPONENTS}#${MY_COMPONENTS}`
            : URL.COMPONENTS,
        );
      }}
      items={[
        {
          key: ALL_COMPONENTS,
          label: 'All',
          children: <ListTable {...tableCommonProps} list={list} />,
        },
        {
          label: 'My Components',
          key: MY_COMPONENTS,
          children: (
            <ListTable
              {...tableCommonProps}
              list={
                searchValue
                  ? list
                  : getMyListOnPagination({
                    total,
                    nextPage: currentPage,
                    list,
                  })
              }
              isAccountRequired
            />
          ),
        },
      ]}
    />
  );
};

export default ListComponents;
