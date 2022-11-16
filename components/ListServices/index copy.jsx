import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { Tabs } from 'antd/lib';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTableCopy';
import { useExtraTabContent } from 'common-util/List/ListTable/helpers';
import { getMyListOnPagination } from 'common-util/ContractUtils/myList';
import {
  getServices,
  getFilteredServices,
  getTotalForAllServices,
  getTotalForMyServices,
} from './utils';

const { TabPane } = Tabs;

const ALL_SERVICES = 'all_services';
const MY_SERVICES = 'my_services';

const ListServices = () => {
  const account = useSelector((state) => get(state, 'setup.account'));
  const [currentTab, setCurrentTab] = useState(ALL_SERVICES);

  /**
   * extra tab content & view click
   */
  const router = useRouter();
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Services',
    onRegisterClick: () => router.push(URL.REGISTER_SERVICE),
  });
  const onViewClick = (id) => router.push(`${URL.COMPONENTS}/${id}`);

  /**
   * filtered list
   */
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);

  // fetch total
  useEffect(() => {
    (async () => {
      if (searchValue === '') {
        try {
          let totalTemp = null;

          // All components
          if (currentTab === ALL_SERVICES) {
            totalTemp = await getTotalForAllServices();
          }

          // My components
          if (currentTab === MY_SERVICES) {
            totalTemp = await getTotalForMyServices(account);
          }

          setTotal(Number(totalTemp));
          if (Number(totalTemp) === 0) {
            setIsLoading(false);
          }
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [account, currentTab, searchValue]);

  useEffect(() => {
    (async () => {
      if (total && currentPage && !searchValue) {
        setIsLoading(true);

        try {
          // All components
          if (currentTab === ALL_SERVICES) {
            setList([]);
            const everyComps = await getServices(total, currentPage);
            setList(everyComps);
          }

          /**
           * My components
           * - search by `account` as searchValue
           * - API will be called only once & store the complete list
           */
          if (currentTab === MY_SERVICES && list.length === 0) {
            setList([]);
            const e = await getFilteredServices(account);
            setList(e);
          }
        } catch (e) {
          console.error(e);
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
          const filteredList = await getFilteredServices(
            searchValue,
            currentTab === MY_SERVICES ? account : null,
          );
          setList(filteredList);
          setTotal(0); // total won't be used if search is used
          setCurrentPage(1);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [account, searchValue]);

  const tableCommonProps = {
    type: NAV_TYPES.SERVICE,
    isLoading,
    total,
    currentPage,
    setCurrentPage,
    onViewClick,
    searchValue,
  };

  return (
    <>
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
        }}
      >
        <TabPane tab="All" key={ALL_SERVICES}>
          <ListTable {...tableCommonProps} list={list} />
        </TabPane>

        <TabPane tab="My Services" key={MY_SERVICES}>
          <ListTable
            {...tableCommonProps}
            list={
              searchValue
                ? list
                : getMyListOnPagination({ total, nextPage: currentPage, list })
            }
            onUpdateClick={(serviceId) => router.push(`${URL.UPDATE_SERVICE}/${serviceId}`)}
            isAccountRequired
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ListServices;
