import { useEffect } from 'react'

const APP_NAME = 'Table Notes'

/** Sets the browser tab / screen-reader page title, e.g. "Journal · Table Notes". */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME
  }, [title])
}
