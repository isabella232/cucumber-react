import React from 'react'
import Tags from './Tags'
import IdGenerator from '../../IdGenerator'
import Description from './Description'
import Scenario from './Scenario'
import { messages } from '@cucumber/messages'
import Rule from './Rule'
import Background from './Background'
import IFeature = messages.GherkinDocument.IFeature
import FeatureTitle from './FeatureTitle'

interface IProps {
  feature: IFeature
}

const generator = new IdGenerator()

const Feature: React.FunctionComponent<IProps> = ({ feature }) => {
  const idGenerated = generator.generate(feature.name)

  return (
    <section className="cucumberFeature">
      <Tags tags={feature.tags} />
      <FeatureTitle
          id={idGenerated}
          feature={feature}
      />
      <div className="cucumberFeature__indent">
        {feature.description ? (
          <Description description={feature.description} />
        ) : null}
        {(feature.children || []).map((child, index) => {
          if (child.background) {
            return <Background key={index} background={child.background} />
          } else if (child.scenario) {
            return <Scenario key={index} scenario={child.scenario} />
          } else if (child.rule) {
            return <Rule key={index} rule={child.rule} />
          } else {
            throw new Error('Expected background, scenario or rule')
          }
        })}
      </div>
    </section>
  )
}

export default Feature
