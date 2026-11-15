"""The completed PDF library belongs in the numerology wing."""
def pdf_library(prefix="../"):
    return f'''<section
        class="library-section wrap section-space"
        id="library"
        aria-labelledby="library-title"
      >
        <div class="section-heading">
          <p class="eyebrow">04 / Download the guides</p>
          <span class="section-aside">Read slowly. Keep what resonates.</span>
        </div>
        <div class="library-heading">
          <div>
            <h2 id="library-title">Go a little <em>deeper.</em></h2>
            <p>
              Researched interpretations. Different perspectives.<br />Seven
              guides to explore at your own pace.
            </p>
          </div>
          <div class="library-controls" hidden data-enhanced-controls>
            <label class="search-label" for="guide-search">Find a guide</label>
            <div class="search-field">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" /></svg
              ><input
                id="guide-search"
                type="search"
                placeholder="Try “soul” or “life path”…"
                autocomplete="off"
              />
            </div>
          </div>
        </div>
        <div class="library-toolbar">
          <div
            class="filter-group"
            role="group"
            aria-label="Filter guides"
            hidden
            data-enhanced-controls
          >
            <button type="button" data-filter="all" aria-pressed="true">
              All guides</button
            ><button type="button" data-filter="core" aria-pressed="false">
              Core numbers</button
            ><button
              type="button"
              data-filter="supporting"
              aria-pressed="false"
            >
              Supporting numbers
            </button>
          </div>
          <p
            id="guide-count"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            7 guides
          </p>
        </div>
        <ul class="guide-list" id="guide-list">
          <li
            class="guide-row"
            data-category="core"
            data-search="life path birth date development lessons"
          >
            <span class="guide-number">01</span>
            <div class="guide-info">
              <h3>Life Path</h3>
              <p>The broad themes of development and life lessons.</p>
            </div>
            <span class="guide-type">Core number</span
            ><a
              class="pdf-link"
              href="{prefix}Life_Path_Research_Guide.pdf"
              download
              aria-label="Download Life Path guide PDF"
              >PDF <span aria-hidden="true">↓</span></a
            >
          </li>
          <li
            class="guide-row"
            data-category="core"
            data-search="destiny expression name capacities abilities talents"
          >
            <span class="guide-number">02</span>
            <div class="guide-info">
              <h3>Destiny / Expression</h3>
              <p>Name-derived capacities and ways of expressing them.</p>
            </div>
            <span class="guide-type">Core number</span
            ><a
              class="pdf-link"
              href="{prefix}output/pdf/Destiny_Expression_Research_Guide.pdf"
              download
              aria-label="Download Destiny and Expression guide PDF"
              >PDF <span aria-hidden="true">↓</span></a
            >
          </li>
          <li
            class="guide-row"
            data-category="core"
            data-search="personality outward first impression consonants"
          >
            <span class="guide-number">03</span>
            <div class="guide-info">
              <h3>Personality</h3>
              <p>The outward impression you may make on others.</p>
            </div>
            <span class="guide-type">Core number</span
            ><a
              class="pdf-link"
              href="{prefix}Personality_Number_Research_Guide.pdf"
              download
              aria-label="Download Personality guide PDF"
              >PDF <span aria-hidden="true">↓</span></a
            >
          </li>
          <li
            class="guide-row"
            data-category="core"
            data-search="soul souls soul's soul’s desire urge heart hearts heart's heart’s inner motivation vowels fulfillment"
          >
            <span class="guide-number">04</span>
            <div class="guide-info">
              <h3>Soul’s Desire</h3>
              <p>Inner motivation, values, and a sense of fulfillment.</p>
            </div>
            <span class="guide-type">Core number</span
            ><a
              class="pdf-link"
              href="{prefix}Souls_Desire_Research_Guide.pdf"
              download
              aria-label="Download Soul’s Desire guide PDF"
              >PDF <span aria-hidden="true">↓</span></a
            >
          </li>
          <li
            class="guide-row"
            data-category="supporting"
            data-search="minor personality current name short social outward impression"
          >
            <span class="guide-number">05</span>
            <div class="guide-info">
              <h3>Minor Personality</h3>
              <p>Everyday presentation through the name you use now.</p>
            </div>
            <span class="guide-type">Supporting number</span
            ><a
              class="pdf-link"
              href="{prefix}output/pdf/Minor_Personality_Research_Guide.pdf"
              download
              aria-label="Download Minor Personality guide PDF"
              >PDF <span aria-hidden="true">↓</span></a
            >
          </li>
          <li
            class="guide-row"
            data-category="supporting"
            data-search="minor soul souls soul's soul’s desire urge heart current name motivation fulfillment"
          >
            <span class="guide-number">06</span>
            <div class="guide-info">
              <h3>Minor Soul’s Desire</h3>
              <p>A current-name lens on motivation and fulfillment.</p>
            </div>
            <span class="guide-type">Supporting number</span
            ><a
              class="pdf-link"
              href="{prefix}output/pdf/Minor_Souls_Desire_Research_Guide.pdf"
              download
              aria-label="Download Minor Soul’s Desire guide PDF"
              >PDF <span aria-hidden="true">↓</span></a
            >
          </li>
          <li
            class="guide-row"
            data-category="supporting"
            data-search="balance difficulty stress response initials"
          >
            <span class="guide-number">07</span>
            <div class="guide-info">
              <h3>Balance</h3>
              <p>Symbolic approaches to responding when life is difficult.</p>
            </div>
            <span class="guide-type">Supporting number</span
            ><a
              class="pdf-link"
              href="{prefix}output/pdf/Balance_Number_Research_Guide.pdf"
              download
              aria-label="Download Balance guide PDF"
              >PDF <span aria-hidden="true">↓</span></a
            >
          </li>
        </ul>
        <div class="empty-search" id="empty-search" hidden>
          <h3>No guides found just yet.</h3>
          <p>Try a different word or view the full collection.</p>
          <button class="text-link" id="clear-search" type="button">
            Show all guides <span aria-hidden="true">→</span>
          </button>
        </div>
        <p class="library-note">
          Each guide includes its calculation conventions and source references.
          Interpretations can differ between traditions.
        </p>
      </section>'''
