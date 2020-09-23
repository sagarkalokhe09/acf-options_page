import React from 'react'
import { OverlayTrigger, Popover, Table } from 'react-bootstrap'
import { ReactComponent as InfoCircle } from 'bootstrap-icons/icons/info-circle.svg'

export const ElementFinderPopover = () => <OverlayTrigger trigger="click" rootClose placement="right" overlay={<Popover id="popover-basic" >
  <Popover.Content>
  &lt;input type=&quot;password&quot; name=&quot;login&quot; id=&quot;username&quot; class=&quot;form-control test&quot; readonly disabled&gt;
    <Table bordered striped className="mt-3">
      <thead>
        <tr>
          <th>getElementBy</th>
          <th>Element Finder</th>
          <th># of elements</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById" target="_blank" rel="noopener noreferrer">getElementById</a></td>
          <td>
            <code>#username</code><br/>
            <code>Id::username</code>
          </td>
          <td>1</td>
        </tr>
        <tr>
          <td><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName" target="_blank" rel="noopener noreferrer">getElementsByClassName</a></td>
          <td>
            <code>ClassName::form-control test</code>
          </td>
          <td>&gt;1</td>
        </tr>
        <tr>
          <td><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName" target="_blank" rel="noopener noreferrer">getElementsByName</a></td>
          <td><code>Name::login</code></td>
          <td>&gt;1</td>
        </tr>
        <tr>
          <td><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName" target="_blank" rel="noopener noreferrer">getElementsByTagName</a></td>
          <td><code>TagName::input</code></td>
          <td>&gt;1</td>
        </tr>
        <tr>
          <td><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector" target="_blank" rel="noopener noreferrer">querySelector</a></td>
          <td>
            <code>Selector::input</code><br/>
            <code>Selector::input[type]</code><br/>
            <code>Selector::input[disabled]</code><br/>
            <code>Selector::input[type=&apos;password&apos;]</code><br/>
            <code>Selector::input[name=&apos;login&apos;]</code><br/>
            <code>Selector::input#username</code><br/>
            <code>Selector::input.form-control.test</code><br/>
          </td>
          <td>1</td>
        </tr>
        <tr>
          <td><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll" target="_blank" rel="noopener noreferrer">querySelectorAll</a></td>
          <td><code>SelectorAll::input</code></td>
          <td>&gt;1</td>
        </tr>
        <tr>
          <td><a href="https://getautoclicker.com/docs/xpath" target="_blank" rel="noopener noreferrer">XPath</a></td>
          <td><code>&#47;&#47;input[contains(@class,&apos;test&apos;)]</code></td>
          <td>&gt;1</td>
        </tr>
      </tbody>
    </Table></Popover.Content>
</Popover>}><InfoCircle className="ml-2 text-info"/></OverlayTrigger>
