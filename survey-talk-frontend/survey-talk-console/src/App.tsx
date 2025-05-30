import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import { RootState } from './redux/root-reducer'

// Containers
const DefaultLayout = React.lazy(() => import('./views/components/layout/defualt-layout/index'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('')
  const uiSlice = useSelector((state: RootState) => state.ui)
  const storedTheme = useSelector((state: any) => state.theme)


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1] || '')
    const themeMatch = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)
    const theme = themeMatch ? themeMatch[0] : undefined
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    // setColorMode(storedTheme)
  }, []) 


  useEffect(() => {
    if (uiSlice && uiSlice.theme) {

      setColorMode(uiSlice.theme)
    }
  }, [uiSlice])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
