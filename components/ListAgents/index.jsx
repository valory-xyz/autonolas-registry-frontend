import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import { notifyError } from '@autonolas/frontend-library';

import { NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import {
  useExtraTabContent,
  getHash,
  isMyTab,
} from 'common-util/List/ListTable/helpers';
import { getMyListOnPagination } from 'common-util/ContractUtils/myList';
import { useHelpers } from 'common-util/hooks';
import {
  getAgents,
  getFilteredAgents,
  getTotalForAllAgents,
  getTotalForMyAgents,
} from './utils';

const ALL_AGENTS = 'all-agents';
const MY_AGENTS = 'my-agents';

const ListAgents = () => {
  const router = useRouter();
  const hash = getHash(router);
  const [currentTab, setCurrentTab] = useState(
    isMyTab(hash) ? MY_AGENTS : ALL_AGENTS,
  );

  const {
    account, chainId, links, isL1OnlyNetwork, isSvm,
  } = useHelpers();

  /**
   * extra tab content & view click
   */
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Agents',
    onRegisterClick: () => router.push(links.MINT_AGENT),
  });
  const onViewClick = (id) => router.push(`${links.AGENTS}/${id}`);

  /**
   * filtered list
   */
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);

  // update current tab based on the "hash" in the links
  useEffect(() => {
    setCurrentTab(isMyTab(hash) ? MY_AGENTS : ALL_AGENTS);
    setList([]);
  }, [router.asPath]);

  // fetch total
  useEffect(() => {
    (async () => {
      if (!isSvm && isL1OnlyNetwork && searchValue === '') {
        try {
          let totalTemp = null;

          // All agents
          if (currentTab === ALL_AGENTS) {
            totalTemp = await getTotalForAllAgents();
          }

          // My agents
          if (currentTab === MY_AGENTS && account) {
            totalTemp = await getTotalForMyAgents(account);
          }

          setTotal(Number(totalTemp));
          if (Number(totalTemp) === 0) {
            setIsLoading(false);
          }
        } catch (e) {
          console.error(e);
          notifyError('Error fetching agents');
        }
      }
    })();
  }, [account, chainId, isL1OnlyNetwork, currentTab, searchValue, isSvm]);

  // fetch the list (without search)
  useEffect(() => {
    (async () => {
      if (!isSvm && isL1OnlyNetwork && total && currentPage && !searchValue) {
        setIsLoading(true);

        try {
          // All agents
          if (currentTab === ALL_AGENTS) {
            setList([]);
            const everyAgents = await getAgents(total, currentPage);
            setList(everyAgents);
          }

          /**
           * My agents
           * - search by `account` as searchValue
           * - API will be called only once & store the complete list
           */
          if (currentTab === MY_AGENTS && list.length === 0 && account) {
            const e = await getFilteredAgents(account);
            setList(e);
          }
        } catch (e) {
          console.error(e);
          notifyError('Error fetching agents');
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [account, chainId, isL1OnlyNetwork, total, currentPage, isSvm]);

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
          notifyError('Error fetching agents');
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [account, chainId, searchValue, currentTab]);

  const tableCommonProps = {
    type: NAV_TYPES.AGENT,
    isLoading,
    total,
    currentPage,
    setCurrentPage,
    onViewClick,
    searchValue,
  };

  const myAgentsList = searchValue
    ? list
    : getMyListOnPagination({ total, nextPage: currentPage, list });

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

        // update the links to keep track of my-agents
        router.push(
          e === MY_AGENTS ? `${links.AGENTS}#${MY_AGENTS}` : links.AGENTS,
        );
      }}
      items={[
        {
          key: ALL_AGENTS,
          label: 'All',
          children: <ListTable {...tableCommonProps} list={list} />,
        },
        {
          key: MY_AGENTS,
          label: 'My Agents',
          children: (
            <ListTable
              {...tableCommonProps}
              list={myAgentsList}
              isAccountRequired
            />
          ),
        },
      ]}
    />
  );
};

export default ListAgents;
