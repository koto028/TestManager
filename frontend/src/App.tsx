import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BoardListPage } from './pages/BoardListPage'
import { BoardDetailPage } from './pages/BoardDetailPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white px-8 py-4 shadow">
            <h1 className="text-xl font-bold">タスクマネージャー</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<BoardListPage />} />
              <Route path="/boards/:id" element={<BoardDetailPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
