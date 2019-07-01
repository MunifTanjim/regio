import TermHeader from 'components/Data/TermHeader.js'
import HeaderGrid from 'components/HeaderGrid.js'
import PrintButtonTeleport from 'components/Navbar/PrintButtonTeleport.js'
import React from 'react'
import { Button, Segment } from 'semantic-ui-react'
import Delete from './ActionModals/Delete.js'
import Courses from './courses/Main.js'

function View({ TermId }) {
  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<TermHeader TermId={TermId} />}
          Right={<Delete TermId={TermId} />}
        />
      </Segment>

      <PrintButtonTeleport.Source>
        <Button
          icon="print"
          content={`Results`}
          as="a"
          href={`/print/terms/${TermId}/results?landscape=true`}
          target="_blank"
        />
      </PrintButtonTeleport.Source>

      <Courses TermId={TermId} />
    </>
  )
}

export default View
