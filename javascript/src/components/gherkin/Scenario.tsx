import React from 'react'
import Tags from './Tags'
import Description from './Description'
import Examples from './Examples'
import { messages } from '@cucumber/messages'
import StepList from './StepList'
import HookList from './HookList'
import IScenario = messages.GherkinDocument.Feature.IScenario
import IdGenerator from '../../IdGenerator'
import ScenarioTitle from './ScenarioTitle'
import CucumberQueryContext from '../../CucumberQueryContext'
import GherkinQueryContext from '../../GherkinQueryContext'
import UriContext from '../../UriContext'

interface IProps {
  scenario: IScenario
}

const generator = new IdGenerator()

const Scenario: React.FunctionComponent<IProps> = ({ scenario }) => {
  const examplesList = scenario.examples || []
  const hasExamples = examplesList.length > 0
  const idGenerated = generator.generate(scenario.name)
  const cucumberQuery = React.useContext(CucumberQueryContext)
  const gherkinQuery = React.useContext(GherkinQueryContext)
  const uri = React.useContext(UriContext)
  const pickleIds = gherkinQuery.getPickleIds(uri, scenario.id)
  const beforeHooks = cucumberQuery.getBeforeHookSteps(pickleIds[0])
  const afterHooks = cucumberQuery.getAfterHookSteps(pickleIds[0])

  return (
    <div className="indent">
      <section>
        <Tags tags={scenario.tags} />
        <ScenarioTitle id={idGenerated} scenario={scenario} />
        <Description description={scenario.description} />
        <HookList hookSteps={beforeHooks} />
        <StepList
          steps={scenario.steps || []}
          renderStepMatchArguments={!hasExamples}
          renderMessage={!hasExamples}
        />
        <HookList hookSteps={afterHooks} />

        {examplesList.map((examples, index) => (
          <Examples key={index} examples={examples} />
        ))}
      </section>
    </div>
  )
}

export default Scenario
