'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './index';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/core/card';

export function AccordionExample() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 p-6">
      {/* 1. Basic Accordion */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-tulpar-blue">
          1. Basic (Single & Collapsible)
        </h3>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Erişilebilirlik standartlarına uygun mu?
            </AccordionTrigger>
            <AccordionContent>
              Evet. Radix UI primitives kullanılarak WAI-ARIA standartlarına ve
              klavye gezinim kurallarına tam uyumlu olarak geliştirilmiştir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Özelleştirilebilir mi?</AccordionTrigger>
            <AccordionContent>
              Kesinlikle. Tulpar brutalist tasarım tokenları ve Tailwind
              sınıfları ile kolayca özelleştirilebilir.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 2. Multiple Accordion */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-tulpar-blue">
          2. Multiple (Çoklu Açılış)
        </h3>
        <Accordion type="multiple" defaultValue={['multi-1']}>
          <AccordionItem value="multi-1">
            <AccordionTrigger>Aynı anda birden fazla sekme açılabilir mi?</AccordionTrigger>
            <AccordionContent>
              Evet, çoklu seçim modu sayesinde kullanıcı dilediği kadar sekmeyi açık bırakabilir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="multi-2">
            <AccordionTrigger>Animasyon performansı nasıldır?</AccordionTrigger>
            <AccordionContent>
              CSS keyframe tabanlı donanım hızlandırmalı animasyonlar
              (`accordion-down` / `accordion-up`) kullanılır.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 3. Disabled Item */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-tulpar-blue">
          3. Disabled (Devre Dışı Öğe)
        </h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="active-1">
            <AccordionTrigger>Aktif Öğe</AccordionTrigger>
            <AccordionContent>
              Bu öğe tıklanabilir ve açılıp kapanabilir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="disabled-1" disabled>
            <AccordionTrigger>Devre Dışı Öğe (Disabled)</AccordionTrigger>
            <AccordionContent>
              Bu içerik açılmaz çünkü öğe devre dışıdır.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 4. Borders Variant */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-tulpar-blue">
          4. Borders (Kenarlıklı Varyant)
        </h3>
        <Accordion
          type="single"
          collapsible
          className="rounded-sm border border-gunmetal/30 px-4"
        >
          <AccordionItem value="border-1">
            <AccordionTrigger>Kenarlıklı Kutu Yapısı</AccordionTrigger>
            <AccordionContent>
              Kök elemana `border` ve `rounded-sm` eklenerek çerçeveli bir kutu
              görünümü elde edilir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="border-2">
            <AccordionTrigger>Son Öğe Kenarlık Davranışı</AccordionTrigger>
            <AccordionContent>
              `last:border-b-0` sınıfı ile son öğenin alt çizgisi temizlenir.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 5. Card Wrapped */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-tulpar-blue">
          5. Card İçinde Kullanım
        </h3>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Sıkça Sorulan Sorular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="card-1">
                <AccordionTrigger>
                  Tulpar bileşen mimarisi nasıldır?
                </AccordionTrigger>
                <AccordionContent>
                  Her bileşen 250 satır kuralına, modüler TypeScript mimarisine
                  ve Radix UI erişilebilirlik standartlarına uyar.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
