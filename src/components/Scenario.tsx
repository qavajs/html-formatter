import {FlexRow, Text, Badge, FlexCell, Accordion} from "@epam/loveship";
import { Step } from "./Step";
import css from "../App.module.scss";
import {FlexSpacer} from "@epam/uui";
import {TimeLabel} from "./TimeLabel";
import {TagList} from './TagList';

const filterByStatus = (scenario: any, status: string) => scenario.steps.filter((step: any) => step.result.status === status);
const getScenarioDuration = (scenario: any) => {
  return `${(scenario.steps.reduce((duration: number, step: any) => duration + (step?.result.duration ?? 0), 0) / 1_000_000_000).toFixed(2)}s`
}
const scenarioTitle = (scenario: any) => function ScenarioTitle() {
  const passed = filterByStatus(scenario, "passed").length;
  const failed = filterByStatus(scenario, "failed").length;
  const skipped = filterByStatus(scenario, "skipped").length;
  const undefinedSteps = filterByStatus(scenario, "undefined").length;
  const ambiguous = filterByStatus(scenario, "ambiguous").length;
  const pending = filterByStatus(scenario, "pending").length;

    return <FlexRow spacing='12' padding='6' vPadding='12' cx={css.scenarioTitle}>
        <Text fontSize='16'>Scenario: {scenario.name}</Text>
        {passed > 0 && <Badge size='24' color='success' fill='outline' caption={passed}/>}
        {failed > 0 && <Badge size='24' color='fire' fill='outline' caption={failed}/>}
        {skipped > 0 && <Badge size='24' color='cobalt' fill='outline' caption={skipped}/>}
        {undefinedSteps > 0 && <Badge size='24' color='yellow' fill='outline' caption={undefinedSteps}/>}
        {ambiguous > 0 && <Badge size='24' color='orange' fill='outline' caption={ambiguous}/>}
        {pending > 0 && <Badge size='24' color='night300' fill='outline' caption={pending}/>}
        {<TagList tags={scenario.tags} itemsToRender={10}/>}
        <FlexSpacer/>
        <TimeLabel time={getScenarioDuration(scenario)}/>
    </FlexRow>
}

export const Scenario = ({ scenario }: {
  scenario: any
}) => {
  return <FlexRow margin="12" spacing="12" key={scenario.id}>
    <FlexCell width="100%">
      <Accordion renderTitle={scenarioTitle(scenario)} mode="block">
        {scenario.steps.map((step: any, index: number) =>
          <Step key={index} step={step} />
        )}
      </Accordion>
    </FlexCell>
  </FlexRow>;
};
