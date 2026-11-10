import { Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { FeaturePage } from './pages/FeaturePage';
import { FailedPage } from './pages/FailedPage';
import { AppHeader } from './AppHeader';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App = () => (
    <>
        <AppHeader/>
        <ErrorBoundary>
            <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/feature/:id' element={<FeaturePage/>}/>
                <Route path='/failed-scenarios' element={<FailedPage/>}/>
                <Route path='*' element={<MainPage/>}/>
            </Routes>
        </ErrorBoundary>
        <footer/>
    </>
);
