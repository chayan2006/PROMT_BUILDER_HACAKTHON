import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Search, Users, Activity, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // AI Chat State
    const [query, setQuery] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/users');
            if (response.data.status === 'success') {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setAnalyzing(true);
        setAnalysis("");

        try {
            const response = await axios.post('http://localhost:8000/admin/analyze', { query });
            if (response.data.status === 'success') {
                setAnalysis(response.data.analysis);
            } else {
                setAnalysis("Error analyzing data: " + response.data.message);
            }
        } catch (error) {
            setAnalysis("Network error connecting to AI.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white shadow rounded-lg p-6 border-l-4 border-indigo-600 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Database className="mr-3 h-6 w-6 text-indigo-600" />
                            Admin Operations Center
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Monitor registered users and interrogate the database using Local AI.
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                            <Users className="h-8 w-8 text-indigo-600 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Total Users</p>
                                <p className="text-xl font-bold text-indigo-900">{users.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: AI Data Analyst */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                                <h3 className="text-lg font-bold text-white flex items-center">
                                    <Activity className="h-5 w-5 mr-2" />
                                    AI Database Analyst
                                </h3>
                                <p className="text-indigo-100 text-sm mt-1">Ask questions about your raw data.</p>
                            </div>

                            {/* Analysis Result Box */}
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                                {analyzing ? (
                                    <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                        <p className="text-sm font-medium">Crunching the numbers...</p>
                                    </div>
                                ) : analysis ? (
                                    <div className="bg-white border text-sm font-mono border-indigo-200 rounded p-4 text-gray-800 shadow-sm whitespace-pre-wrap">
                                        {analysis}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center px-4">
                                        Ask me things like:<br /><br />"How many users are on the Active plan?"<br />"What is the most common status?"
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleAnalyze} className="p-4 bg-white border-t border-gray-200">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ask the database..."
                                        className="w-full border border-gray-300 rounded-full pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        disabled={analyzing}
                                    />
                                    <button
                                        type="submit"
                                        disabled={analyzing || !query.trim()}
                                        className="absolute right-1 top-1 bottom-1 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        <Search className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Data Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg overflow-hidden h-[500px] flex flex-col">
                            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Raw User Database
                                </h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Live from Supabase
                                </span>
                            </div>

                            <div className="flex-1 overflow-auto">
                                {loadingData ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {user.status || 'Free'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono text-xs">
                                                        {user.payment_id ? user.payment_id.slice(0, 10) + '...' : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                                        No users found in database.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
