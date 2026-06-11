import { Routes, Route } from 'react-router-dom'
import { AuthLayout, MainLayout, PublicLayout } from '@/shared/layouts'
import { HomePage } from '@/module/home'
import { FAQPage } from '@/module/faq'
import { TermsPage, PrivacyPage } from '@/module/legal'
import LoginPage from '@/module/auth/pages/LoginPage'
import RegisterPage from '@/module/auth/pages/RegisterPage'
import GroupsPage from '@/module/groups/pages/GroupsPage'
import RankingPage from '@/module/ranking/pages/RankingPage'
import BracketPage from '@/module/bracket/pages/BracketPage'
import ProfilePage from '@/module/profile/pages/ProfilePage'
import GuidePage from '@/module/profile/pages/GuidePage'
import AdminGroupsPage from '@/module/admin/pages/AdminGroupsPage'
import AdminBracketPage from '@/module/admin/pages/AdminBracketPage'
import RequireNonAdmin from '@/shared/components/RequireNonAdmin'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/guide" element={<RequireNonAdmin><GuidePage /></RequireNonAdmin>} />
        <Route path="/groups" element={<RequireNonAdmin><GroupsPage /></RequireNonAdmin>} />
        <Route path="/ranking" element={<RequireNonAdmin><RankingPage /></RequireNonAdmin>} />
        <Route path="/bracket" element={<RequireNonAdmin><BracketPage /></RequireNonAdmin>} />
        <Route path="/admin/groups" element={<AdminGroupsPage />} />
        <Route path="/admin/bracket" element={<AdminBracketPage />} />
      </Route>
    </Routes>
  )
}