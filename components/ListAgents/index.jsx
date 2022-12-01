import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { Tabs } from 'antd/lib';
import { useRouter } from 'next/router';
import { URL, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import {
  useExtraTabContent,
  getHash,
  isMyTab,
} from 'common-util/List/ListTable/helpers';
import { getMyListOnPagination } from 'common-util/ContractUtils/myList';
import {
  getAgents,
  getFilteredAgents,
  getTotalForAllAgents,
  getTotalForMyAgents,
} from './utils';

const { TabPane } = Tabs;

const ALL_AGENTS = 'all-agents';
const MY_AGENTS = 'my-agents';

const ListAgents = () => {
  const router = useRouter();
  const hash = getHash(router);
  const [currentTab, setCurrentTab] = useState(
    isMyTab(hash) ? MY_AGENTS : ALL_AGENTS,
  );

  const account = useSelector((state) => get(state, 'setup.account'));

  /**
   * extra tab content & view click
   */
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Agents',
    onRegisterClick: () => router.push(URL.REGISTER_AGENT),
  });
  const onViewClick = (id) => router.push(`${URL.AGENTS}/${id}`);

  /**
   * filtered list
   */
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);

  // update current tab based on the "hash" in the URL
  useEffect(() => {
    setCurrentTab(isMyTab(hash) ? MY_AGENTS : ALL_AGENTS);
    setList([]);
  }, [router.asPath]);

  // fetch total
  useEffect(() => {
    (async () => {
      if (searchValue === '') {
        try {
          let totalTemp = null;

          // All agents
          if (currentTab === ALL_AGENTS) {
            totalTemp = await getTotalForAllAgents();
          }

          // My agents
          if (currentTab === MY_AGENTS) {
            totalTemp = await getTotalForMyAgents(account);
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

  // fetch the list (without search)
  useEffect(() => {
    (async () => {
      if (total && currentPage && !searchValue) {
        setIsLoading(true);

        try {
          // All agents
          if (currentTab === ALL_AGENTS) {
            setList([]);
            const everyComps = await getAgents(total, currentPage);
            setList(everyComps);
          }

          /**
           * My agents
           * - search by `account` as searchValue
           * - API will be called only once & store the complete list
           */
          if (currentTab === MY_AGENTS && list.length === 0) {
            const e = await getFilteredAgents(account);
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
   * Search (All agents, My agents)
   * - no pagination as we won't know total beforehand as we have to
   *   traverse the entire list
   */
  useEffect(() => {
    (async () => {
      if (searchValue) {
        setIsLoading(true);
        setList([]);

        try {
          const filteredList = await getFilteredAgents(
            searchValue,
            currentTab === MY_AGENTS ? account : null,
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
    type: NAV_TYPES.AGENT,
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

          // update the URL to keep track of my-agents
          router.push(
            e === MY_AGENTS ? `${URL.AGENTS}#${MY_AGENTS}` : URL.AGENTS,
          );
        }}
      >
        <TabPane tab="All" key={ALL_AGENTS}>
          <ListTable {...tableCommonProps} list={list} />
        </TabPane>

        <TabPane tab="My Agents" key={MY_AGENTS}>
          <ListTable
            {...tableCommonProps}
            list={
              searchValue
                ? list
                : getMyListOnPagination({ total, nextPage: currentPage, list })
            }
            isAccountRequired
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ListAgents;
