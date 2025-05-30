import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../../redux/root-reducer'
import { JwtUtil } from '../../../../core/utils/jwt.util'
import { get_roleNav } from '../../../../_role-nav'
import { logo } from '../../../../assets/brand/logo'
import { sygnet } from '../../../../assets/brand/sygnet'
import { UiState } from '../../../../redux/ui/ui.slice'

const AppSidebar = () => {
  // const unfoldable = useSelector((state : State) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state: UiState) => state.sidebarShow)

  // STATES
  const [navigation, setNavigation] = useState<any[]>([]);

  // HOOKS
  const navigate = useNavigate();

  // REDUX
  const dispatch = useDispatch()
  const uiSlice = useSelector((state: RootState) => state.ui)
  const authSlice = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    if (authSlice && authSlice.token) {
      const user = JwtUtil.decodeToken(authSlice.token);

      //*[NOTE] Sau có thay đổi role thì gọi lại hàm này
      setNavigation(get_roleNav(user.role_id, user.id));

    } else {
      navigate("/login")
    }
  }, [authSlice])
  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      // unfoldable={unfoldable}
      visible={uiSlice.sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand >
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />

      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
