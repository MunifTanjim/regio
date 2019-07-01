import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'

export const i18n = setupI18n()

class LazyI18nProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      catalogs: {},
      ready: false
    }
  }

  componentDidMount = () => {
    const { locale } = this.props

    this.loadCatalog(locale.language, () => {
      i18n.load(this.state.catalogs)
      i18n.activate(locale.language)
      this.setState({ ready: true })
    })
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { locale } = this.props
    const { locale: nextLocale } = nextProps
    const { catalogs } = nextState

    if (
      nextLocale.language !== locale.language &&
      !catalogs[nextLocale.language]
    ) {
      this.loadCatalog(nextLocale.language)
      return false
    }

    return true
  }

  loadCatalog = async (language, callback) => {
    try {
      const catalog = await fetchCatalog(language)

      this.setState(
        ({ catalogs }) => ({
          catalogs: {
            ...catalogs,
            [language]: catalog
          }
        }),
        callback
      )
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  render() {
    const { children, locale } = this.props
    const { catalogs, ready } = this.state

    return catalogs[locale.language] && ready ? (
      <I18nProvider i18n={i18n} language={locale.language} catalogs={catalogs}>
        {children}
      </I18nProvider>
    ) : null
  }
}

const mapStateToProps = ({ ui: { locale } }) => ({ locale })

export default connect(mapStateToProps)(LazyI18nProvider)

async function fetchCatalog(language) {
  if (process.env.NODE_ENV === 'production') {
    return import(/* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */ `./locales/${language}/messages.js`)
  } else {
    return import(/* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */ `@lingui/loader!./locales/${language}/messages.po`)
  }
}
