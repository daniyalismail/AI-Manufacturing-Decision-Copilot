#!/bin/bash
find app components -type f -name "*.tsx" -print0 | while IFS= read -r -d '' file; do
  sed -i 's/bg-\[var(--color-cream-paper)\]/bg-cream-paper/g' "$file"
  sed -i 's/bg-\[var(--color-pure-white)\]/bg-pure-white/g' "$file"
  sed -i 's/bg-\[var(--color-ink-black)\]/bg-ink-black/g' "$file"
  sed -i 's/bg-\[var(--color-fresh-grass)\]/bg-fresh-grass/g' "$file"
  sed -i 's/bg-\[var(--color-sky-pop)\]/bg-sky-pop/g' "$file"
  sed -i 's/bg-\[var(--color-coral-pop)\]/bg-coral-pop/g' "$file"
  sed -i 's/bg-\[var(--color-sunshine-pop)\]/bg-sunshine-pop/g' "$file"
  sed -i 's/bg-\[var(--color-sandstone)\]/bg-sandstone/g' "$file"
  
  sed -i 's/text-\[var(--color-ink-black)\]/text-ink-black/g' "$file"
  sed -i 's/text-\[var(--color-pure-white)\]/text-pure-white/g' "$file"
  sed -i 's/text-\[var(--color-stone-gray)\]/text-stone-gray/g' "$file"
  sed -i 's/text-\[var(--color-sky-pop)\]/text-sky-pop/g' "$file"
  sed -i 's/text-\[var(--color-coral-pop)\]/text-coral-pop/g' "$file"
  
  sed -i 's/border-\[var(--color-hairline-mist)\]/border-hairline-mist/g' "$file"
  sed -i 's/border-\[var(--color-ink-black)\]/border-ink-black/g' "$file"
  sed -i 's/border-\[var(--color-sky-pop)\]/border-sky-pop/g' "$file"
  sed -i 's/border-\[var(--color-coral-pop)\]/border-coral-pop/g' "$file"
  
  sed -i 's/rounded-\[var(--radius-nav)\]/rounded-\[50px\]/g' "$file"
  sed -i 's/rounded-\[var(--radius-lg)\]/rounded-\[10px\]/g' "$file"
  sed -i 's/rounded-\[var(--radius-cards)\]/rounded-\[50px\]/g' "$file"
  
  sed -i 's/mb-\[var(--spacing-20)\]/mb-5/g' "$file"
  sed -i 's/mb-\[var(--spacing-60)\]/mb-\[60px\]/g' "$file"
  sed -i 's/pt-\[var(--spacing-60)\]/pt-\[60px\]/g' "$file"
  sed -i 's/pb-\[var(--spacing-136)\]/pb-\[136px\]/g' "$file"
  sed -i 's/gap-\[var(--element-gap)\]/gap-5/g' "$file"
  
  # Typography fixes
  sed -i 's/text-\[var(--text-body-sm)\]/text-\[15px\]/g' "$file"
  sed -i 's/text-\[var(--text-body-lg)\]/text-\[18px\]/g' "$file"
  sed -i 's/text-\[var(--text-subheading)\]/text-\[20px\]/g' "$file"
  sed -i 's/text-\[var(--text-heading-sm)\]/text-\[30px\]/g' "$file"
  sed -i 's/text-\[var(--text-heading)\]/text-\[53px\]/g' "$file"
  sed -i 's/text-\[var(--text-heading-lg)\]/text-\[81px\]/g' "$file"
  sed -i 's/text-\[var(--text-display)\]/text-\[140px\]/g' "$file"
  
  # Tracking and Leading
  sed -i 's/tracking-\[var(--text-display--letter-spacing)\]/tracking-\[-8.4px\]/g' "$file"
  sed -i 's/tracking-\[var(--text-heading-lg--letter-spacing)\]/tracking-\[-4.86px\]/g' "$file"
  sed -i 's/tracking-\[var(--text-heading--letter-spacing)\]/tracking-\[-2.12px\]/g' "$file"
  
  sed -i 's/leading-\[var(--text-display--line-height)\]/leading-\[0.95\]/g' "$file"
  sed -i 's/leading-\[var(--text-heading-lg--line-height)\]/leading-\[1.2\]/g' "$file"
  sed -i 's/leading-\[var(--text-heading--line-height)\]/leading-\[1.15\]/g' "$file"
  sed -i 's/leading-\[var(--text-heading-sm--line-height)\]/leading-\[1.2\]/g' "$file"
  sed -i 's/leading-\[var(--text-subheading--line-height)\]/leading-\[1.25\]/g' "$file"
  sed -i 's/leading-\[var(--text-body-lg--line-height)\]/leading-\[1.5\]/g' "$file"
done
