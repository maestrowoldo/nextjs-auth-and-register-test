import { ReactNode } from 'react';
import { issueCsrf } from '../../(auth)/_csrf';

export default function AuthLayout({ children }: { children: ReactNode }) {
  issueCsrf();
  return <>{children}</>;
}