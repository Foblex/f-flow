import {ChangeDetectionStrategy, Component, inject, model} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {UserService} from "../auth/user-service";
import {toSignal} from "@angular/core/rxjs-interop";
import {SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatInput,
    MatButtonModule,
  ]
})
export class AssistantComponent  {

  protected readonly user = toSignal(inject(UserService).user$);

  protected readonly question = model<string>();
  protected readonly answer = model<SafeHtml | undefined>(`<div _ngcontent-ng-c4219792277=""><h1>Installing the Library and Rendering Your First Flow</h1>
<p>In this guide, you’ll learn how to set up <strong>Foblex Flow</strong> in your Angular project and render your first interactive flow — complete with draggable nodes and dynamic connections. <strong>Foblex Flow</strong> is a lightweight, flexible library for building flow-based UIs natively in Angular.</p>
<h2 id="🚀-installation">🚀 Installation</h2>
<p><strong>Foblex Flow</strong> provides a schematic for quick setup. Just run the following command in your Angular project to install and configure everything automatically:</p>
<f-code-group class="f-code-group"><f-code-group-tabs class="f-code-group-tabs" ng-reflect-data="[object Object],[object Object" style="display: block;"><button class="f-tab-button active"> install </button><button class="f-tab-button"> update </button><!--container--></f-code-group-tabs><div class="f-code-group-body"><!--container--><f-code-view class="f-code-view" ng-reflect-data="[object Object]" style="display: block;"><span class="f-code-language">bash</span><button class="f-copy-button"></button><highlight ng-reflect-content="ng add @foblex/flow
" ng-reflect-language="bash"><pre class="shiki universal" style="background-color:transparent;color:var(--code-view-text-color)" tabindex="0"><code><span class="line"><span style="color:var(--token-tag)">ng</span><span style="color:var(--token-string)"> add</span><span style="color:var(--token-string)"> @foblex/flow</span></span>
<span class="line"></span></code></pre></highlight><!--container--></f-code-view><!--container--><!--container--><f-code-view class="f-code-view" ng-reflect-data="[object Object]" style="display: none;"><span class="f-code-language">bash</span><button class="f-copy-button"></button><highlight ng-reflect-content="ng update @foblex/flow
" ng-reflect-language="bash"><pre class="shiki universal" style="background-color:transparent;color:var(--code-view-text-color)" tabindex="0"><code><span class="line"><span style="color:var(--token-tag)">ng</span><span style="color:var(--token-string)"> update</span><span style="color:var(--token-string)"> @foblex/flow</span></span>
<span class="line"></span></code></pre></highlight><!--container--></f-code-view><!--container--><!--container--></div></f-code-group><h2 id="🔧-basic-flow-example">🔧 Basic Flow Example</h2>
<p>Here’s the most minimal working example — a canvas with two nodes and one connection between them:</p>
<f-code-group class="f-code-group"><f-code-group-tabs class="f-code-group-tabs" ng-reflect-data="[object Object]" style="display: none;"><button class="f-tab-button active">  </button><!--container--></f-code-group-tabs><div class="f-code-group-body"><!--container--><f-code-view class="f-code-view" ng-reflect-data="[object Object]" style="display: block;"><span class="f-code-language">html</span><button class="f-copy-button"></button><highlight ng-reflect-content="&lt;f-flow fDraggable&gt;
  &lt;f-canva" ng-reflect-language="angular-html"><pre class="shiki universal" style="background-color:transparent;color:var(--code-view-text-color)" tabindex="0"><code><span class="line"><span style="color:var(--code-view-text-color)">&lt;</span><span style="color:var(--token-tag)">f-flow</span><span style="color:var(--token-tag)"> fDraggable</span><span style="color:var(--code-view-text-color)">&gt;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">  &lt;</span><span style="color:var(--token-tag)">f-canvas</span><span style="color:var(--code-view-text-color)">&gt;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    &lt;</span><span style="color:var(--token-tag)">f-connection</span><span style="color:var(--token-tag)"> fOutputId</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"output1"</span><span style="color:var(--token-tag)"> fInputId</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"input1"</span><span style="color:var(--code-view-text-color)">&gt;&lt;/</span><span style="color:var(--token-tag)">f-connection</span><span style="color:var(--code-view-text-color)">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-view-text-color)">    &lt;</span><span style="color:var(--token-tag)">div</span></span>
<span class="line"><span style="color:var(--token-tag)">      fNode</span></span>
<span class="line"><span style="color:var(--token-tag)">      fDragHandle</span></span>
<span class="line"><span style="color:var(--token-tag)">      fNodeOutput</span></span>
<span class="line"><span style="color:var(--token-tag)">      [fNodePosition]</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"{ x: 32, y: 32 }"</span></span>
<span class="line"><span style="color:var(--token-tag)">      fOutputId</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"output1"</span></span>
<span class="line"><span style="color:var(--token-tag)">      fOutputConnectableSide</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"right"</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    &gt;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">      Node 1</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    &lt;/</span><span style="color:var(--token-tag)">div</span><span style="color:var(--code-view-text-color)">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-view-text-color)">    &lt;</span><span style="color:var(--token-tag)">div</span></span>
<span class="line"><span style="color:var(--token-tag)">      fNode</span></span>
<span class="line"><span style="color:var(--token-tag)">      fDragHandle</span></span>
<span class="line"><span style="color:var(--token-tag)">      fNodeInput</span></span>
<span class="line"><span style="color:var(--token-tag)">      [fNodePosition]</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"{ x: 240, y: 32 }"</span></span>
<span class="line"><span style="color:var(--token-tag)">      fInputId</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"input1"</span></span>
<span class="line"><span style="color:var(--token-tag)">      fInputConnectableSide</span><span style="color:var(--code-view-text-color)">=</span><span style="color:var(--token-string)">"left"</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    &gt;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">      Node 2</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    &lt;/</span><span style="color:var(--token-tag)">div</span><span style="color:var(--code-view-text-color)">&gt;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">  &lt;/</span><span style="color:var(--token-tag)">f-canvas</span><span style="color:var(--code-view-text-color)">&gt;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">&lt;/</span><span style="color:var(--token-tag)">f-flow</span><span style="color:var(--code-view-text-color)">&gt;</span></span>
<span class="line"></span></code></pre></highlight><!--container--></f-code-view><!--container--><!--container--></div></f-code-group><h2 id="🎨-styling-basics">🎨 Styling Basics</h2>
<p><strong>Foblex Flow</strong> doesn’t enforce any styling, giving you full design control. Here’s a sample style sheet to help you get started:</p>
<f-code-group class="f-code-group"><f-code-group-tabs class="f-code-group-tabs" ng-reflect-data="[object Object]" style="display: none;"><button class="f-tab-button active">  </button><!--container--></f-code-group-tabs><div class="f-code-group-body"><!--container--><f-code-view class="f-code-view" ng-reflect-data="[object Object]" style="display: block;"><span class="f-code-language">scss</span><button class="f-copy-button"></button><highlight ng-reflect-content=".f-flow {
  height: 400px;
}

" ng-reflect-language="scss"><pre class="shiki universal" style="background-color:transparent;color:var(--code-view-text-color)" tabindex="0"><code><span class="line"><span style="color:var(--token-tag)">.f-flow</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-function)">  height</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">400</span><span style="color:var(--token-keyword)">px</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--token-tag)">.f-node</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-function)">  padding</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">24</span><span style="color:var(--token-keyword)">px</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--token-function)">  color</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-function)">rgba</span><span style="color:var(--code-view-text-color)">(</span><span style="color:var(--token-number)">60</span><span style="color:var(--code-view-text-color)">, </span><span style="color:var(--token-number)">60</span><span style="color:var(--code-view-text-color)">, </span><span style="color:var(--token-number)">67</span><span style="color:var(--code-view-text-color)">);</span></span>
<span class="line"><span style="color:var(--token-function)">  text-align</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-function)">center</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--token-function)">  background</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">#ffffff</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--token-function)">  border-radius</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">2</span><span style="color:var(--token-keyword)">px</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--token-function)">  border</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">0.2</span><span style="color:var(--token-keyword)">px</span><span style="color:var(--token-function)"> solid</span><span style="color:var(--token-function)"> rgba</span><span style="color:var(--code-view-text-color)">(</span><span style="color:var(--token-number)">60</span><span style="color:var(--code-view-text-color)">, </span><span style="color:var(--token-number)">60</span><span style="color:var(--code-view-text-color)">, </span><span style="color:var(--token-number)">67</span><span style="color:var(--code-view-text-color)">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--token-tag)">  &amp;.f-selected</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-function)">    border-color</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">#3451b2</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--token-comment)">    // Highlights the border when the node is selected</span></span>
<span class="line"><span style="color:var(--token-comment)">    // The f-selected class is automatically added by the library when a node or connection is selected.</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">  }</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--token-tag)">.f-drag-handle</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-tag)">  cursor</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-function)">move</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-view-text-color)">::</span><span style="color:var(--token-tag)">ng-deep</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-tag)">  .f-connection</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-tag)">    .f-connection-drag-handle</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-function)">      fill</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-function)">transparent</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--token-comment)">      // By default, this element has a black fill and is used to detect the start of dragging (e.g., onmousedown).</span></span>
<span class="line"><span style="color:var(--token-comment)">      // We make it transparent to avoid visual clutter, while keeping it functional.</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--token-tag)">    .f-connection-selection</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-function)">      stroke-width</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">10</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--token-comment)">      // This is a pseudo-connection (a copy of the main path) used to make it easier to select the connection.</span></span>
<span class="line"><span style="color:var(--token-comment)">      // It's slightly thicker than the actual path (which is often only 1px), making it easier to interact with.</span></span>
<span class="line"><span style="color:var(--token-comment)">      // It remains invisible to avoid affecting visual clarity but stays active for user interaction.</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--token-tag)">    .f-connection-path</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-function)">      stroke</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-function)">rgba</span><span style="color:var(--code-view-text-color)">(</span><span style="color:var(--token-number)">60</span><span style="color:var(--code-view-text-color)">, </span><span style="color:var(--token-number)">60</span><span style="color:var(--code-view-text-color)">, </span><span style="color:var(--token-number)">67</span><span style="color:var(--code-view-text-color)">);</span></span>
<span class="line"><span style="color:var(--token-function)">      stroke-width</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">2</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--token-tag)">    &amp;.f-selected</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-tag)">      .f-connection-path</span><span style="color:var(--code-view-text-color)"> {</span></span>
<span class="line"><span style="color:var(--token-function)">        stroke</span><span style="color:var(--code-view-text-color)">: </span><span style="color:var(--token-number)">#3451b2</span><span style="color:var(--code-view-text-color)">;</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">      }</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">    }</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">  }</span></span>
<span class="line"><span style="color:var(--code-view-text-color)">}</span></span>
<span class="line"></span></code></pre></highlight><!--container--></f-code-view><!--container--><!--container--></div></f-code-group><hr>
<f-code-group class="f-code-group"><f-code-group-tabs class="f-code-group-tabs" ng-reflect-data="[object Object]" style="display: none;"><button class="f-tab-button active"> Example </button><!--container--></f-code-group-tabs><div class="f-code-group-body"><f-example-view class="f-example-view" ng-reflect-data="[object Object]" style="display: block; height: 300px;">
<draggable-flow _nghost-ng-c3908388264=""><f-flow _ngcontent-ng-c3908388264="" fdraggable="" class="f-component f-flow" _nghost-ng-c3639991742="" id="f-flow-1"><f-canvas _ngcontent-ng-c3908388264="" class="f-component f-canvas" _nghost-ng-c4038700004="" style="transform: matrix(1, 0, 0, 1, 0, 0)"><div _ngcontent-ng-c4038700004=""></div><div _ngcontent-ng-c4038700004=""><f-connection _ngcontent-ng-c3908388264="" foutputid="output1" finputid="input1" class="f-component f-connection" _nghost-ng-c2870291701="" ng-reflect-f-output-id="output1" ng-reflect-f-input-id="input1" id="f-connection-2"><svg _ngcontent-ng-c2870291701="" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; display: block; vertical-align: middle;"><defs _ngcontent-ng-c2870291701=""></defs><g _ngcontent-ng-c2870291701="" class="f-connection-group"><linearGradient _ngcontent-ng-c2870291701="" fConnectionGradient="" class="f-component f-connection-gradient" x1="0" y1="0.5" x2="1" y2="0.5" id="connection_gradient_f-connection-2output1input1"><stop offset="0%" stop-color="black"></stop><stop offset="100%" stop-color="black"></stop><!--ng-container--></linearGradient><path _ngcontent-ng-c2870291701="" fConnectionSelection="" class="f-component f-connection-selection" _nghost-ng-c4253464552="" d="M 144 60.5 L 244.0002 60.5002" id="connection_for_selection_f-connection-2output1input1"></path><g _ngcontent-ng-c2870291701=""><path _ngcontent-ng-c2870291701="" f-connection-path="" class="f-component f-connection-path" _nghost-ng-c98541502="" marker-start="url(#f-connection-marker-start-f-connection-2)" marker-end="url(#f-connection-marker-end-f-connection-2)" d="M 144 60.5 L 244.0002 60.5002" id="connection_f-connection-2output1input1" data-f-path-id="f-connection-2" stroke="url(#connection_gradient_f-connection-2output1input1)"></path><!--container--><circle _ngcontent-ng-c2870291701="" f-connection-drag-handle-end="" r="8" cx="236" cy="60.5" class="f-connection-drag-handle"></circle></g><text _ngcontent-ng-c2870291701="" f-connection-text="" class="f-component f-connection-text" dy="-12.8" transform="" id="connection_text_f-connection-2output1input1" style="display: unset;"><textPath f-connection-text-path="" startOffset="50%" text-anchor="middle" href="#connection_f-connection-2output1input1">  </textPath><!--ng-container--></text></g></svg><!--container--></f-connection></div><div _ngcontent-ng-c4038700004=""><div _ngcontent-ng-c3908388264="" fnode="" fdraghandle="" fnodeoutput="" foutputid="output1" foutputconnectableside="right" class="f-component f-node-output f-node f-drag-handle f-node-output-self-connectable f-node-output-connected f-node-output-not-connectable" ng-reflect-f-id="output1" ng-reflect-user-f-connectable-side="right" ng-reflect-position="[object Object]" data-f-output-id="output1" data-f-node-id="f-node-3" style="transform: translate(24px, 24px) rotate(0deg); position: absolute; transform-origin: center center; user-select: none; pointer-events: all; left: 0px; top: 0px;"> Node 1 </div><div _ngcontent-ng-c3908388264="" fnode="" fdraghandle="" fnodeinput="" finputid="input1" finputconnectableside="left" class="f-component f-node-input f-node f-drag-handle f-node-input-multiple f-node-input-connected" ng-reflect-f-id="input1" ng-reflect-user-f-connectable-side="left" ng-reflect-position="[object Object]" data-f-input-id="input1" data-f-node-id="f-node-4" style="transform: translate(244px, 24px) rotate(0deg); position: absolute; transform-origin: center center; user-select: none; pointer-events: all; left: 0px; top: 0px;"> Node 2 </div></div><!--ng-container--></f-canvas><!--ng-container--></f-flow></draggable-flow><!--ng-container--><!--container--></f-example-view><!--container--><!--container--><!--container--></div></f-code-group><h2 id="🔍-explanation">🔍 Explanation</h2>
<ul>
<li><a href="/docs/f-flow-component"><code>&lt;f-flow&gt;</code></a> — the root component that manages the flow state.</li>
<li><a href="/docs/f-canvas-component"><code>&lt;f-canvas&gt;</code></a> — the layer where nodes and connections are placed.</li>
<li><a href="/docs/f-node-directive"><code>fNode</code></a> — directive representing a node.</li>
<li><a href="/docs/f-node-output-directive"><code>fNodeOutput</code></a> / <a href="/docs/f-node-input-directive"><code>fNodeInput</code></a> — connectors for connections. fNodeOutput is the source, and fNodeInput is the target.</li>
<li><a href="/docs/f-connection-component"><code>&lt;f-connection&gt;</code></a> — the component that renders a connection between two connectors by their fOutputId and fInputId.</li>
</ul>
<p>⚠️ <strong>Note</strong>: <code>fOutputId</code> and <code>fInputId</code> may technically match, since they belong to different connector collections. However, this is not recommended, as future versions may unify these into a single fConnector directive where matching IDs would cause conflicts.</p>
<h2 id="🧪-try-it-yourself">🧪 Try It Yourself</h2>
<p>Enhance your flow with the following:</p>
<ul>
<li>Change the <code>[fNodePosition]</code> coordinates</li>
<li>Add more <code>fNode</code> and <code>f-connection</code> elements</li>
<li>Experiment with connection sides: <code>fOutputConnectableSide</code>, <code>fInputConnectableSide</code></li>
<li>Modify the connection type or behavior using the <code>fType</code> and <code>fBehaviour</code> inputs.</li>
<li><code>fType</code>: defines the visual style of the connection. Acceptable values from the <code>EFConnectionType</code> enum include: <code>straight</code>, <code>bezier</code>, <code>segment</code>. You can also pass a string for a custom connection type.</li>
</ul>
<p>To create a custom connection type, see <a href="./examples/custom-connection-type">documentation here</a>.</p>
<ul>
<li><code>fBehavior</code>: defines the connection behavior, including positioning and flexibility. Acceptable values from <code>EFConnectionBehavior</code> include: <code>fixed</code>, <code>fixed_center</code>, <code>floating</code>. Default: <code>EFConnectionBehavior.FIXED</code>.</li>
</ul>
<h2 id="⚙️-customization-notes">⚙️ Customization Notes</h2>
<ul>
<li>Total freedom in node visuals — use any Angular component, not just <code>&lt;div&gt;</code>.</li>
<li>Fully SSR-compatible, and works with Angular Signals and standalone components.</li>
<li>You define the UI, the flow engine handles interactions.</li>
</ul>
<h2 id="🐞-common-mistakes">🐞 Common Mistakes</h2>
<ul>
<li>❌ Forgot \`[fNodePosition] → nodes will not render.</li>
<li>❌ <code>fOutputId</code> or \`fInputId don’t match the ones set in connectors — connections won’t render.</li>
<li>❌ Placing elements outside <a href="/docs/f-canvas-component"><code>&lt;f-canvas&gt;</code></a> — <a href="/docs/f-node-directive"><code>fNode</code></a> and <a href="/docs/f-connection-component"><code>&lt;f-connection&gt;</code></a> must be within it.</li>
</ul>
<h2 id="🔍-internals:-how-it-works">🔍 Internals: How It Works</h2>
<ol>
<li>Each node is registered with its coordinates and metadata.</li>
<li>Connections reference nodes by their fOutputId and fInputId.</li>
<li>SVG lines are calculated between node anchors and rendered live.</li>
<li>On drag/move, connections automatically reflow and update visually.</li>
</ol>
<h2 id="🙌-get-involved">🙌 Get Involved</h2>
<p>If you find <strong>Foblex Flow</strong> useful — drop a ⭐ on <a href="https://github.com/Foblex/f-flow">GitHub</a>, join the conversation, and help shape the roadmap!</p>
</div>`);
}
