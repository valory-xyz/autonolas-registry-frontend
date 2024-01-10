import { useState, useEffect, useCallback } from 'react';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import { notifyError } from '@autonolas/frontend-library';

import { VM_TYPE, NAV_TYPES } from 'util/constants';
import ListTable from 'common-util/List/ListTable';
import {
  useExtraTabContent,
  getHash,
  isMyTab,
} from 'common-util/List/ListTable/helpers';
import { getMyListOnPagination } from 'common-util/ContractUtils/myList';
import { useHelpers } from 'common-util/hooks';
import { useSvmInfo } from 'common-util/hooks/useSvmInfo';
import {
  getServices,
  getFilteredServices,
  getTotalForAllServices,
  getTotalForMyServices,
} from './utils';
// import * as anchor from "@coral-xyz/anchor";

const ALL_SERVICES = 'all-services';
const MY_SERVICES = 'my-services';

const ListServices = () => {
  const router = useRouter();
  const hash = getHash(router);
  const [currentTab, setCurrentTab] = useState(
    isMyTab(hash) ? MY_SERVICES : ALL_SERVICES,
  );

  const {
    account, chainId, links, vmType,
  } = useHelpers();

  /**
   * extra tab content & view click
   */
  const { searchValue, extraTabContent, clearSearch } = useExtraTabContent({
    title: 'Services',
    onRegisterClick: () => router.push(links.MINT_SERVICE),
  });
  const onViewClick = (id) => router.push(`${links.SERVICES}/${id}`);

  /**
   * filtered list
   */
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);

  // update current tab based on the "hash" in the URL
  useEffect(() => {
    setCurrentTab(isMyTab(hash) ? MY_SERVICES : ALL_SERVICES);
    setList([]);
  }, [router.asPath, hash]);

  const { storagePublicKey, isProgramInstanceReady, getProgramInstance } = useSvmInfo();
  const program = getProgramInstance();

  const getSvmServiceTotal = useCallback(async () => {
    if (isProgramInstanceReady && storagePublicKey && program) {
      const response = await program.methods
        .totalSupply()
        .accounts({
          dataAccount: storagePublicKey,
          isSigner: false,
        })
        .view();
      return response;
    }

    return 0;
  }, [isProgramInstanceReady, storagePublicKey, program]);

  // fetch total
  useEffect(() => {
    const getTotal = async () => {
      try {
        if (vmType === VM_TYPE.SVM) {
          let totalTemp = null;

          if (currentTab === ALL_SERVICES) {
            totalTemp = await getSvmServiceTotal();
            console.log('totalTemp', totalTemp);
          } else if (currentTab === MY_SERVICES && account) {
            // totalTemp = await getTotalForMyServices(account);
            // TODO
          }

          setTotal(Number(totalTemp));
          if (Number(totalTemp) === 0) {
            setIsLoading(false);
          }
        } else if (chainId) {
          /* ethereum & its testnets */
          let totalTemp = null;

          if (currentTab === ALL_SERVICES) {
            totalTemp = await getTotalForAllServices();
          } else if (currentTab === MY_SERVICES && account) {
            totalTemp = await getTotalForMyServices(account);
          }

          setTotal(Number(totalTemp));
          if (Number(totalTemp) === 0) {
            setIsLoading(false);
          }
        }
      } catch (e) {
        console.error(e);
        notifyError('Error fetching services');
      }
    };

    if (searchValue === '') {
      getTotal();
    }
  }, [
    account,
    chainId,
    currentTab,
    searchValue,
    vmType,
    getProgramInstance,
    getSvmServiceTotal,
  ]);

  // fetch the list (without search)
  useEffect(() => {
    const getList = async () => {
      setIsLoading(true);

      try {
        // TODO: remove this once solana is ready
        if (vmType === VM_TYPE.SVM) {
          setList([]);
          setIsLoading(false);
          return;
        }

        /* ethereum & its testnets */
        // All services
        if (currentTab === ALL_SERVICES) {
          setList([]);
          const everyComps = await getServices(total, currentPage);
          setList(everyComps);
        }

        /**
         * My services
         * - search by `account` as searchValue
         * - API will be called only once & store the complete list
         */
        if (currentTab === MY_SERVICES && list.length === 0 && account) {
          setList([]);
          const e = await getFilteredServices(account);
          setList(e);
        }
      } catch (e) {
        console.error(e);
        notifyError('Error fetching services list');
      } finally {
        setIsLoading(false);
      }
    };

    if (total && currentPage && !searchValue) {
      getList();
    }
  }, [
    account,
    chainId,
    total,
    currentPage,
    vmType,
    currentTab,
    searchValue,
    // list?.length,
  ]);

  /**
   * Search (All services, My Services)
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
          notifyError('Error fetching services');
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [account, chainId, searchValue, currentTab]);

  const tableCommonProps = {
    type: NAV_TYPES.SERVICE,
    isLoading,
    total,
    currentPage,
    setCurrentPage,
    onViewClick,
    searchValue,
  };

  const myServiceList = searchValue
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

        // update the URL to keep track of my-services
        router.push(
          e === MY_SERVICES
            ? `${links.SERVICES}#${MY_SERVICES}`
            : links.SERVICES,
        );
      }}
      items={[
        {
          key: ALL_SERVICES,
          label: 'All',
          children: <ListTable {...tableCommonProps} list={list} />,
        },
        {
          key: MY_SERVICES,
          label: 'My Services',
          children: (
            <ListTable
              {...tableCommonProps}
              list={myServiceList}
              onUpdateClick={(serviceId) => router.push(`${links.UPDATE_SERVICE}/${serviceId}`)}
              isAccountRequired
            />
          ),
        },
      ]}
    />
  );
};

export default ListServices;
