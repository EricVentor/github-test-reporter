import * as core from '@actions/core'
import { CtrfTest } from "../../types/ctrf"
import { getTestName } from "../common"
import { getEmojiForStatus } from "./common"

export function generateTestDetailsTable(tests: CtrfTest[], useSuiteName: boolean): void {
    try {
      core.summary.addHeading(`Detailed Test Results`, 3)
  
      const maxRows = 8000
      let limitedTests = tests
  
      if (tests.length > maxRows) {
        limitedTests = tests.slice(0, maxRows)
      }
  
      const headers = [
        { data: 'Name', header: true },
        { data: 'Status', header: true },
        { data: 'ms', header: true },
        { data: 'Flaky 🍂', header: true },
      ]
  
      const rows = limitedTests.map((test) => [
        { data: getTestName(test, useSuiteName), header: false },
        {
          data: `${test.status} ${getEmojiForStatus(test.status)}`,
          header: false,
        },
        { data: test.duration.toString(), header: false },
        { data: test.flaky ? 'Yes' : '', header: false },
      ])
  
      core.summary.addTable([headers, ...rows])
  
      if (tests.length > maxRows) {
        core.summary.addRaw(
          `Note: You have a lot of tests. We've limited the number shown in the detailed breakdown to ${maxRows}.`
        )
      }
      core.summary.addLink(
        'Github Actions Test Reporter CTRF',
        'https://github.com/ctrf-io/github-actions-test-reporter-ctrf'
      )
    } catch (error) {
      if (error instanceof Error) {
        core.setFailed(`Failed to append to job summary: ${error.message}`)
      } else {
        core.setFailed('An unknown error occurred')
      }
    }
  }