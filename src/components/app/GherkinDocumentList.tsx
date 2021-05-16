import React from 'react'
import GherkinDocument from '../gherkin/GherkinDocument'
import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import UriContext from '../../UriContext'
import GherkinQueryContext from '../../GherkinQueryContext'
import CucumberQueryContext from '../../CucumberQueryContext'
import StatusIcon from '../gherkin/StatusIcon'
import styles from './GherkinDocumentList.module.scss'

const GherkinDocumentList: React.FunctionComponent<{
  gherkinDocuments?: ReadonlyArray<messages.GherkinDocument>
}> = ({ gherkinDocuments }) => {
  const gherkinQuery = React.useContext(GherkinQueryContext)
  const cucumberQuery = React.useContext(CucumberQueryContext)

  const gherkinDocs =
    gherkinDocuments === undefined ? gherkinQuery.getGherkinDocuments() : gherkinDocuments

  const entries: Array<[string, messages.TestStepResultStatus]> = gherkinDocs.map(
    (gherkinDocument) => {
      const gherkinDocumentStatus = gherkinDocument.feature
        ? getWorstTestStepResult(
            cucumberQuery.getPickleTestStepResults(gherkinQuery.getPickleIds(gherkinDocument.uri))
          ).status
        : messages.TestStepResultStatus.UNDEFINED
      return [gherkinDocument.uri, gherkinDocumentStatus]
    }
  )
  const gherkinDocumentStatusByUri = new Map(entries)

  // Pre-expand any document that is *not* passed - assuming this is what people want to look at first
  const preExpanded = gherkinDocs
    .filter((doc) => gherkinDocumentStatusByUri.get(doc.uri) !== 'PASSED')
    .map((doc) => doc.uri)

  return (
    <div className={styles.list}>
      <Accordion
        allowMultipleExpanded={true}
        allowZeroExpanded={true}
        preExpanded={preExpanded}
        className={styles.accordion}
      >
        {gherkinDocs.map((doc) => {
          const gherkinDocumentStatus = gherkinDocumentStatusByUri.get(doc.uri)

          return (
            <AccordionItem key={doc.uri} uuid={doc.uri} className={styles.accordionItem}>
              <AccordionItemHeading>
                <AccordionItemButton className={styles.accordionButton}>
                  <span className={styles.icon}>
                    <StatusIcon status={gherkinDocumentStatus} />
                  </span>
                  <span>{doc.uri}</span>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className={styles.accordionPanel}>
                <UriContext.Provider value={doc.uri}>
                  <GherkinDocument gherkinDocument={doc} />
                </UriContext.Provider>
              </AccordionItemPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default GherkinDocumentList
