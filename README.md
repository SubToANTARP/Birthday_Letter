# An Enchanted Birthday Letter

## Preview Stage 3

Open `index.html` in your browser. No installation, build, internet connection, or server is needed.

For a local HTTP preview, run `python -m http.server 8000` from this folder, then visit http://localhost:8000. Stop it with Ctrl+C.

Click or tap the heart-sealed envelope to open your birthday letter while all twelve roses bloom. You can also Tab to the envelope and press Enter or Space. The experience plays once; refresh the page to replay.

The wave opens the four top roses from left to right, then alternates down the left and right borders. Flowers start 190 milliseconds apart; layered petal contours unfurl over approximately 3.72 seconds in total and stay open. A single native `requestAnimationFrame` loop animates the SVG control points, with no library download or network requirement. Reduced-motion preferences reveal the final flowers immediately on activation.

The new envelope-and-letter sequence uses a locally bundled GSAP timeline. The envelope lifts, the heart seal gently pulses and releases, and the original flap hinges open. A folded letter rises behind a foreground copy of the existing envelope folds, clears the opening, and unfolds into stationery. The sequence settles after 4.25 seconds. The original rose animation starts on the same click and is unchanged.

The closed scene, positions, colors, vines, and envelope artwork are preserved. The letter stays open, receives keyboard focus after the reveal, and scrolls internally for longer messages. Reduced-motion preferences show the open letter and bloomed flowers immediately. Resizing during the reveal settles the letter into its responsive layout.

## Git checkpoints

Git commit `536f588` (`Preserve approved Stage 1 birthday letter design`) contains the complete approved Stage 1 files and both reference sketches, committed before Stage 2 changes.

Git commit `63ed8d0` (`Preserve approved Stage 2 rose blooming experience`) contains the approved rose-blooming version, committed before any Stage 3 changes.

## Personalize

The placeholder letter is in `index.html`, immediately below `<!-- EDIT YOUR BIRTHDAY LETTER HERE -->`. Replace the heading, paragraphs, and signature directly. You can add more paragraphs or headings before `<!-- END OF YOUR BIRTHDAY LETTER -->`. Save the file and refresh your browser to see the updated letter.

`styles.css` controls the responsive layout and stationery. `script.js` contains the original botanical artwork and rose animation, followed by a clearly separated Stage 3 section. `vendor/gsap.min.js` is bundled locally, so the page needs no internet connection, package installation, external fonts, or build step. Include the `vendor` folder when copying or hosting the site.

## How to test

1. Open `index.html` and click the envelope. Roses should bloom immediately while the envelope gently lifts and the seal pulses.
2. Watch the flap open, then the folded paper rise from behind the envelope's front folds. The paper unfolds and settles after about 4.25 seconds.
3. Click repeatedly during playback: the sequence should continue once. The letter should remain visible afterward.
4. Refresh, Tab to the envelope, and press Enter or Space. After opening, Tab into the message to scroll it with the keyboard.
5. Add a long message in the marked HTML section. Check that only the message scrolls and the floral border stays clear.
6. Test a narrow browser window, then resize during the reveal. The paper should settle into its responsive size without clipping text or covering the flowers.
7. Enable your operating system's reduced-motion preference, refresh, and activate the envelope. Both flowers and letter should immediately show their final states.

## Verification

Chrome checks cover desktop and 320px/390px phone-sized viewports, all twelve roses, progressive flap movement, upward letter emergence, front-pocket occlusion, both unfolding panels, repeated-click prevention, Enter/Space input, long-message scrolling, and reduced motion. Initial desktop and mobile screenshots match the Stage 2 checkpoint pixel-for-pixel. The Stage 2 rose implementation is unchanged. Test pages reported no JavaScript errors.

## Next stages

4. Add gentle atmosphere, idle movement, and reduced-motion alternatives.
5. Verify the full sequence on desktop and mobile.

For GitHub Pages, these files can be served directly from the repository root once the experience is complete.
