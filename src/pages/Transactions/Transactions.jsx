import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionTable from "../../components/transactions/TransactionTable";
import { fetchTransactions } from "../../store/slices/transactionSlice";
import LoadingState from "../../components/common/LoadingState";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";

export default function Transactions() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.transactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Filter transactions based on search term
  // Adjust the filtering properties based on your transaction object structure
  const filteredTransactions =
    items?.filter(
      (transaction) =>
        transaction.transactionDate
          ?.toString()
          .includes(searchTerm.toLowerCase()) ||
        transaction.customer?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.user?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (transaction.amount &&
          transaction.amount.toString().includes(searchTerm))
    ) || [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle pagination page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page
  const resetPage = () => setCurrentPage(1);

  return (
    <div className="container p-4 mx-auto transition-colors duration-200">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 transition-colors duration-200 md:text-2xl dark:text-white">
          Transaksi
        </h1>
      </div>

      {loading ? (
        <div className="p-8 text-center transition-colors duration-200 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-gray-900/10">
          <LoadingState message="Memuat data transaksi..." />
        </div>
      ) : (
        <div className="overflow-hidden transition-colors duration-200 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-gray-900/10">
          {/* Search Bar Component */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Cari transaksi berdasarkan ID, nama pelanggan, atau status..."
            resetPage={resetPage}
          />

          {/* Transaction Table with filtered data */}
          <TransactionTable transactions={currentTransactions} />

          {/* Pagination Component */}
          <div className="px-6 py-3">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredTransactions.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
